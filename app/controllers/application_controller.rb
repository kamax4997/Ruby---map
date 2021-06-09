class ApplicationController < ActionController::Base
  $countRequestsBosch = 0
  
  before_filter :handle_cookies
  def handle_cookies
    # config values for SSO SDK 
    @clientId = Rails.application.config.login_clientId
    @environment= Rails.application.config.login_environment
    @type= Rails.application.config.login_type
    @lang= Rails.application.config.login_lang
    @screenconfig= Rails.application.config.login_screenconfig
	
	# config values for JS API 3.0
	@app_id_global = Rails.application.config.app_id_global
	@app_code_global = Rails.application.config.app_code_global
	@app_id_cors = Rails.application.config.app_id_cors
	@app_code_cors = Rails.application.config.app_code_cors
	@app_id_jp = Rails.application.config.app_id_jp
	@app_code_jp = Rails.application.config.app_code_jp
	
	# config values for JS API 3.1
	@api_key = Rails.application.config.api_key
	@api_key_jp = Rails.application.config.api_key_jp

    # page url for redirect  
    page_url = request.original_url
    @hideLogOut = "false"
    checkCookie = false
	
  # get user agent
	useragent =  request.headers['user-agent']
    # depending on enviornment check cookies
    if(Rails.env.production?)
       checkCookie = true
       sessionCookie =cookies[:here_auth]
    elsif
        # un-comment the following to enable login in dev
        #checkCookie = true
        @environment= Rails.application.config.login_dev_environment
        sessionCookie=cookies[:here_auth_st]
    end
	
    # No need for login check on landing and TeamSupport pages and rest api controller
    # if app_id and app_code given in the page url, ignore HERE SSO
    if(page_url == root_url or page_url.include? "technical_support" or page_url.include? "getlatestrelease" or page_url.include? "rest/extract" or (page_url.include? "app_id" and page_url.include? "app_code"))
     checkCookie = false
   end
   
   # Fix for redirect issue when opening from power point
   if !useragent.nil?
	   if useragent.include? "Microsoft Office" or  useragent.include? "ms-office"
		 checkCookie = false
	   end
   end
   
    # default redirect url is langing page
    @original_url = root_url
    if checkCookie 
      # cookie to check if authenticated
      if sessionCookie == nil || sessionCookie == ""
        if page_url.include? "login"
           # pass redirect url stored in session as parameter
           # If user directly opened login page then redirect to
           # landing page
           @original_url = session[:original_url]
           if !@original_url.nil? and @original_url.include? "login" 
               redirect_landing
           end
        else
            # store last redirect url
           session[:original_url] = page_url
           redirect_to "/login" 
           @hideLogOut = "true"
        end
      elsif  page_url.include? "login"
        redirect_landing
      end
    else
     @hideLogOut = "true"
    end
   
 end
 
 def redirect_landing
    session[:original_url] = root_url
    redirect_to root_url
 end
  
 
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
end
