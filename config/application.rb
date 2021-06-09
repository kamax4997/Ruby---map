require File.expand_path('../boot', __FILE__)

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module HereTcs
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    # Do not swallow errors in after_commit/after_here_auth_qarollback callbacks.
    config.active_record.raise_in_transactional_callbacks = true

    # Configure HERE credentials
    config.app_id = 'dIqjg3N5LuHG1QAwHbwD'
    config.app_code = 'rJbZNQB3EN3oB4NqHaFXTQ'
    # HERE Account integration configs
    config.login_clientId =  'inCUge3uprAQEtRaruyaZ8'
    config.login_environment = 'https://account.here.com'
    config.login_type = 'frame'
    config.login_lang = 'en-EN'
    config.login_screenconfig = 'password'
    config.login_dev_environment = 'https://st.p.account.here.com'
    config.bosch_resthost='http://34.209.174.200'
	config.action_dispatch.default_headers = {
      'X-Frame-Options' => 'ALLOWALL',
      'X-XSS-Protection' => '1; mode=block',
      'X-Content-Type-Options' => 'nosniff'
    }
    
    # specify new app_id / app_code for productive mode and dev mode here!!!
    config.app_id_global = 'inCUge3uprAQEtRaruyaZ8'
    config.app_code_global = '9Vyk_MElhgPCytA7z3iuPA'
	config.app_id_cors = 	'BTp1kLd1IpptcQe2Ir3h'
    config.app_code_cors =	'zMDPaKTAFR2g3wF3h4ok7w'
	config.app_id_jp = 'dPNJ6XzVATngXoWhlqx7'
	config.app_code_jp = 'qUYWNNt0HKi8B9JhTGKNIA'
	
	# for js api 3.1 (app_id : 02aNLyqsJvBnA18RFjnH) ==> BlackListed for over usage
  # config.api_key = 'FdX8ng49KKL5M4Dail77oRCl0AbLF2sFo8fkrWMpLPk'
  # for js api 3.1 (app_id : akl066ieG9nLbhXEWANd)
	config.api_key = '3lKmytJ9qwM22dCKUNNbu2C6zab5zWXYPy5lGKGdYM4'
	#Japan api key (app_id : kDaunY5Arh4kq38xawKr)
  config.api_key_jp = '_U80GrbnQYHbU_QeWhGY70qeAKNE5mzInsZM6w4Tq2U' # APP ID: OV6n0T6POyODRz1FbXOj
  config.api_key_jp_rest = 'C4qtrsh1ciA07R4bARhgmVmdAkKlyOiuvYIKBD4CeHM' # APP ID: kDaunY5Arh4kq38xawKr
    
    if(!Rails.env.production?)
        config.app_id_global = 'sJ144gmf7ZZQnBrsUGlF'
        config.app_code_global = 'FLvpeHcGwrntfYPYq41qcA'
		OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE
        config.bosch_resthost='http://127.0.0.1:8080'
    end
	
    # add Font Support in assets
    config.assets.enabled = true  
    config.assets.paths << Rails.root.join("app", "assets", "fonts")


  end
end
