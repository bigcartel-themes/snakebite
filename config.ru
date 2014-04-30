require 'dugway'

options = {}

# Use data from any store to make sure your theme looks great with all sorts of products, pages,
# categories, and more. Just give us the subdomain. Default is "dugway" for dugway.bigcartel.com.
# options[:store] = 'testdriveluna'

options[:customization] = {
  :slideshow => [
    { :url => 'images/snakebite-slide-1.jpg', :width => 1400, :height => 700, :name => 'Snake One' },
    { :url => 'images/snakebite-slide-2.jpg', :width => 1400, :height => 700, :name => 'Snake Two' },
    { :url => 'images/snakebite-slide-3.jpg', :width => 1400, :height => 700, :name => 'Snake Three' }
  ]
}

# Simulate the customization done by store owners by passing values to different variables.
# Default values are based on the "default" for each setting in your settings.json.
# options[:customization] = {
#   :logo => {
#     :url => 'http://placehold.it/200x50/000000/ffffff&text=My+Logo',
#     :width => 200,
#     :height => 50
#   },
#   :background_color => '#CCCCCC',
#   :show_search => true,
#   :twitter_username => 'mytwitter'
# }

run Dugway.application(options)
