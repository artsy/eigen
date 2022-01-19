# frozen_string_literal: true

require 'faraday'
require 'fileutils'
require 'json'

# doc
class Image
  GEMINI_PROXY = 'https://d7hftxdivxxvm.cloudfront.net/'

  attr_reader :data

  def initialize(data)
    @data = data
  end

  def token
    @data['gemini_token']
  end

  def larger_url
    @data.dig('image_urls', 'larger')
  end

  def normalized_url
    @data.dig('image_urls', 'normalized')
  end

  def cropped_url(width: '800', height: '800')
    params = {
      convert_to: 'webp',
      height: height,
      quality: '50',
      resize_to: 'width',
      token: token,
      width: width
    }

    query = params.map { |key, value| [key, value].join('=') }.join('&')

    [GEMINI_PROXY, query].join('?')
  end
end

# doc
class Artwork
  def initialize(data)
    @data = data
  end

  def first_image
    @first_image ||= Image.new(@data['images'].first)
  end
end

# remove the images from last time
FileUtils.rm_rf('image_tinkering/downloads')

saturday_url = 'https://artsy-public.s3.amazonaws.com/artworks-of-the-day/2022-01-15.json'
response = Faraday.get(saturday_url)
data = JSON.parse(response.body)
artworks = data.map { |d| Artwork.new(d) }
images = artworks.map(&:first_image)

images.each do |image|
  folder = "image_tinkering/downloads/#{image.token}"
  FileUtils.mkdir_p(folder)

  full_bleed_cropped_image_url = image.cropped_url(width: 1000, height: 1000)

  image_types = [
    { format: 'jpg', name: 'larger', url: image.larger_url },
    { format: 'jpg', name: 'normalized', url: image.normalized_url },
    { format: 'webp', name: 'fullBleedCropped', url: full_bleed_cropped_image_url },
    { format: 'webp', name: 'smallFeaturedCropped', url: image.cropped_url(width: 500, height: 500) }
  ]

  image_types.each do |type|
    path = "#{folder}/#{type[:name]}.#{type[:format]}"
    response = Faraday.get(type[:url])
    File.write(path, response.body)
  end

  sizes = `cd #{folder} && identify *`
  puts folder
  puts full_bleed_cropped_image_url
  puts sizes
  puts "\n"
end
