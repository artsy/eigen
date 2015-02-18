require 'dnssd'
require 'json'
require 'logger'
require 'rack'

CONFIG = {
  :name    => "Artsy-FairEnough-Server",
  :type    => "_http._tcp",
  :domain  => nil,
  :host    => '0.0.0.0', # any interface
  :port    => 3456,
  :handler => Rack::Handler::WEBrick,
}

LOGGER = Logger.new(STDERR)
LOGGER.level = Logger::DEBUG

def register_bonjour_service!
  service = DNSSD::Service.new
  Thread.new do
    Thread.current.abort_on_exception = true
    service.register(*CONFIG.values_at(:name, :type, :domain, :port)) do |reply|
      LOGGER.info "Registered Bonjour service at: #{reply.fullname}"
    end
  end
  at_exit do
    LOGGER.info "Stopping Bonjour service..."
    service.stop
  end
end

App = Rack::Builder.new do
  use Rack::Logger, LOGGER

  map '/fair/manifest' do
    run(Proc.new do |env|
      [
        '200',
        { 'Content-Type' => 'application/json' },
        [{ 'fair' => 'Armory 2015', 'package-size' => '42' }.to_json]
      ]
    end)
  end
end

CONFIG[:handler].run(App, :Host => CONFIG[:host], :Port => CONFIG[:port], :Logger => LOGGER) do |server|
  register_bonjour_service!
end
