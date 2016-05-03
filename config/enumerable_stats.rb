# Remove once real plugin support exists for danger
# see: https://github.com/danger/danger/pull/145

module Enumerable

  def sum
    self.inject(0){|accum, i| accum + i }
  end

  def mean
    self.sum/self.length.to_f
  end

  def sample_variance
    m = self.mean
    sum = self.inject(0){|accum, i| accum +(i-m)**2 }
    (1/self.length.to_f*sum)
  end

  def standard_deviation
    return Math.sqrt(self.sample_variance)
  end

  def valuesOutsideStandardDeviation(deviation)
    m = self.mean
    sd = self.standard_deviation
    self.select { |n| (m-n).abs > (deviation * sd) }
  end
end

