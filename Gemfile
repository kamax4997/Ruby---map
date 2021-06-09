source 'http://rubygems.org'

group :development, :production do
  # Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
  gem 'rails', '4.2.3'
  # Use sqlite3 as the database for Active Record
  gem 'sqlite3'
  # Include Passenger
  gem 'passenger'
  # Use Bootstrap and  SCSS for stylesheets
  gem 'bootstrap-sass', '~> 3.3.5'
  gem 'sass-rails', '~> 5.0'
  # Use Uglifier as compressor for JavaScript assets
  gem 'uglifier', '>= 1.3.0'
  # Use CoffeeScript for .coffee assets and views
  gem 'coffee-rails', '~> 4.1.0'
  gem 'coffee-script-source', '1.8.0'
  # See https://github.com/rails/execjs#readme for more supported runtimes
  # gem 'therubyracer', platforms: :ruby
  gem 'tzinfo-data'
  # Include Faraday for HTTP REST requests
  gem 'faraday'
  # Use jquery as the JavaScript library
  gem 'jquery-rails'
  gem 'jquery-ui-rails'
  gem 'jquery-turbolinks'
  # Include fancybox
  gem 'fancybox2-rails', '~> 0.2.8'
  # Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
  gem 'turbolinks'
  # Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
  gem 'jbuilder', '~> 2.0'
  # bundle exec rake doc:rails generates the API under doc/api.
  gem 'sdoc', '~> 0.4.0', group: :doc
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  # Include datetime picker for bootstrap
  gem 'momentjs-rails', '>= 2.9.0'
  gem 'bootstrap3-datetimepicker-rails', '~> 4.14.30'
end

# Setting up a deployment group allows to only install gems needed for deployment in CI server which saves deploy time
group :deploy do
  # Deploy with Capistrano and rbenv
  gem 'capistrano'
  gem 'capistrano-bundler'
  gem 'capistrano-rails'
  gem 'capistrano-rbenv', github: "capistrano/rbenv"
end
