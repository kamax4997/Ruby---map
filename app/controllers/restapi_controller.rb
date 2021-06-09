require 'net/http'
class RestapiController < ApplicationController
	skip_before_action :verify_authenticity_token
	def index
		Rails.logger.debug("index")
	end
   
	def AutoClassExtractorInterface
		if request.raw_post.length > 2000000 #2 Mbyte, but it seems nginx has already restriction until 1Mbytes
			send_data '{error: "The upload file should not be more than 2 Megabytes"}', type: "application/javascript", disposition: 'inline'
			return
		end
		if $countRequestsBosch > 10
			send_data '{error: "The upload file requests are reached to 10 at time"}', type: "application/javascript", disposition: 'inline'
			return
		end
		host = Rails.application.config.bosch_resthost
		page_url = host+'/AutoClassExtractorInterface/get?'
		callback= params[:callback]
		app_id= params[:app_id]
		app_code= params[:app_code]
		file= params[:file]
		lng= params[:lng]

		
		if not callback.to_s.empty?
			page_url += '&callback='+callback
		end

		if not app_id.to_s.empty?
			page_url += '&app_id='+app_id
		end
		
		if not app_code.to_s.empty?
			page_url += '&app_code='+app_code
		end
		
		if not lng.to_s.empty?
			page_url += "&lng="+lng
		end
		
		if not file.to_s.empty?
			page_url += '&file='+file
		end
		$countRequestsBosch += 1
		return callExtract(page_url, true)
	end
   
	def callExtract(page_url, autoClassExtractor)
		headers['Access-Control-Allow-Origin'] = '*'
		headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
		headers['Access-Control-Request-Method'] = '*'
		headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
		
		url_encoded_string = URI.encode(page_url)
		
		url = URI.parse(url_encoded_string)
	
		if not request.post?
			req = Net::HTTP::Get.new(url.to_s)
			req['FROM_TCS_EXT_HERE_COM'] = 'true'
			res = Net::HTTP.start(url.host, url.port, :read_timeout => 300) {|http|
				http.request(req)
			}
			send_data res.body, type: res['content-type'], disposition: 'inline'
		else
			req = Net::HTTP::Post.new(url.to_s)
			req['FROM_TCS_EXT_HERE_COM'] = 'true'
			req.body = request.raw_post

			res = Net::HTTP.start(url.host, url.port, :read_timeout => 300) {|http|
				http.request(req)
			}
			if(autoClassExtractor != nil && autoClassExtractor == true)
				$countRequestsBosch -= 1
			end
			send_data res.body, type: res['content-type'], disposition: 'inline'
		end	
	end

	def RoadSegmentService
		host = Rails.application.config.bosch_resthost
		page_url = host+'/RoadSegmentService/get?'
		callback= params[:jsoncallback]
		app_id= params[:app_id]
		app_code= params[:app_code]
		prox= params[:prox]
		tilexy= params[:tilexy]
		fc2= params[:fc2]
		
		if not callback.to_s.empty?
			page_url += '&jsoncallback='+callback
		end

		if not app_id.to_s.empty?
			page_url += '&app_id='+app_id
		end
		
		if not app_code.to_s.empty?
			page_url += '&app_code='+app_code
		end
		
		if not prox.to_s.empty?
			page_url += '&prox='+prox
		end
		
		if not tilexy.to_s.empty?
			page_url += '&tilexy=' + tilexy
		end
		
		if not fc2.to_s.empty?
			page_url += '&fc2=true'
		end
		
		headers['Access-Control-Allow-Origin'] = '*'
		headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
		headers['Access-Control-Request-Method'] = '*'
		headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
		
		url_encoded_string = URI.encode(page_url)
		
		url = URI.parse(url_encoded_string)
	
		req = Net::HTTP::Get.new(url.to_s)
		req['FROM_TCS_EXT_HERE_COM'] = 'true'
		res = Net::HTTP.start(url.host, url.port, :read_timeout => 300) {|http|
			http.request(req)
		}
		send_data res.body, type: "application/javascript", disposition: 'inline'
	end
	
	def proxy
		headers['Access-Control-Allow-Origin'] = '*'
		headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
		headers['Access-Control-Request-Method'] = '*'
		headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'

		page_url = params[:url]
		
		params.each do |key,value|
			if(key != "controller" && key != "action" && key != "url")
				page_url += "&" + key + "=" + value
			end
		end
		
		Rails.logger.warn "url #{page_url}"
		
		uri_str = URI.encode(page_url)
		url = URI.parse(uri_str)
		
		http = Net::HTTP.new(url.host, url.port)
		http.read_timeout = 1000
		http.use_ssl = (url.scheme == 'https')
		http.verify_mode = OpenSSL::SSL::VERIFY_NONE  
		request = Net::HTTP::Get.new(uri_str)
		response = http.start {|http| http.request(request) }
		send_data response.body, type: response['content-type'], disposition: 'inline'
	end
   
   def getdata
		host = Rails.application.config.bosch_resthost
		headers['Access-Control-Allow-Origin'] = '*'
		headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
		headers['Access-Control-Request-Method'] = '*'
		headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'

		release = params[:SCHEMA]
		countryCode = params[:ISO_COUNTRY_CODE]
		trafficSignType = params[:TRAFFIC_SIGN_TYPE]
		conditionType= params[:CONDITION_TYPE]
		callback= params[:callback]
		detailColumns = ["LAT","LAT","LON","LINK_ID","CONDITION_ID","CONDITION_TYPE","CONDITION_DESC","ISO_COUNTRY_CODE2","TRAFFIC_SIGN_TYPE","TRAFFIC_SIGN_DESC","TRAFFIC_SIGN_VALUE","HEADING","SIGN_DURATION_TEXT","SIGN_PREWARNING_TEXT","SIGN_VAL_TIME_TEXT","GEN_WARNING_SIGN_TYPE","SIGN_DURATION","SIGN_PREWARNING","SIGN_VALIDITY_TIME","SIGN_VEHICLE_TRUCK","SIGN_VEHICLE_HEAVY_TRUCK","SIGN_VEHICLE_BUS","SIGN_VEHICLE_AUTO_TRAILER","SIGN_VEHICLE_MOTORHOME","SIGN_VEHICLE_MOTORCYCLE","DIRECTION","RAILWAY_CROSSING_TYPE","WEATHER_TYPE","IMPORTANCE_IND"]

		if trafficSignType.present?
			page_url = host+'/restService/rest/fetch?callback='+callback+'&data={"tableName":"BOSCH_TRAFFIC_SIGNS_DETAIL_'+release+'","columns":['+detailColumns.join(",")+'],"predicate":"ISO_COUNTRY_CODE2=\''+countryCode+'\' AND TRAFFIC_SIGN_TYPE IN ('+trafficSignType+')"}'
		 end

		if conditionType.present?
		  page_url = host+'/restService/rest/fetch?callback='+callback+'&data={"tableName":"BOSCH_TRAFFIC_SIGNS_DETAIL_'+release+'","columns":['+detailColumns.join(",")+'],"predicate":"ISO_COUNTRY_CODE2=\''+countryCode+'\' AND CONDITION_TYPE ='+conditionType+'"}'
		end

		if not(trafficSignType.present?) and not (conditionType.present?)
			page_url = host+'/restService/rest/fetchBatch?fileName='+release+"_"+countryCode+'&data={"tableName":"BOSCH_TRAFFIC_SIGNS_DETAIL_'+release+'","columns":['+detailColumns.join(",")+'],"predicate":"ISO_COUNTRY_CODE2=\''+countryCode+'\'"}'
		end

		url_encoded_string = URI.encode(page_url)
		puts url_encoded_string
		url = URI.parse(url_encoded_string)
		req = Net::HTTP::Get.new(url.to_s)
		res = Net::HTTP.start(url.host, url.port, :read_timeout => 300) {|http|
		   http.request(req)
		}
		send_data res.body, type: res['content-type'], disposition: 'inline'
	end
  
	def getreleasedata
		host = Rails.application.config.bosch_resthost
		callback= params[:callback]
		email = params[:emaild]
		headers['Access-Control-Allow-Origin'] = '*'
		headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
		headers['Access-Control-Request-Method'] = '*'
		headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
		page_url = host+'/restService/rest/fetch?callback='+callback+'&data={"tableName":"BOSCH_MAP_RELEASES","columns":["REGION","REGION_DESC","QUARTER","SCHEMA","DVN"]}'
		url_encoded_string = URI.encode(page_url)
		puts url_encoded_string
		url = URI.parse(url_encoded_string)
		req = Net::HTTP::Get.new(url.to_s)
		res = Net::HTTP.start(url.host, url.port,:read_timeout => 300) {|http|
			http.request(req)
		}
		send_data res.body, type: res['content-type'], disposition: 'inline'
	end
  
	def countrydata
		host = Rails.application.config.bosch_resthost
		release = params[:SCHEMA]
		callback= params[:callback]
		headers['Access-Control-Allow-Origin'] = '*'
		headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
		headers['Access-Control-Request-Method'] = '*'
		headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
		page_url = host+'/restService/rest/fetch?callback='+callback+'&data={"tableName":"N_ISO3166","columns":["ALPHA2","ALPHA2","ALPHA3","ENGLISH"],"predicate":"NT_ISOCC3 in (SELECT DISTINCT(ISO_COUNTRY_CODE) from BOSCH_SIGN_TPS_CNTRY_'+release+') ORDER BY ENGLISH"}'
		url_encoded_string = URI.encode(page_url)
		puts url_encoded_string
		url = URI.parse(url_encoded_string)
		req = Net::HTTP::Get.new(url.to_s)
		res = Net::HTTP.start(url.host, url.port,:read_timeout => 300) {|http|
		   http.request(req)
		}
		send_data res.body, type: res['content-type'], disposition: 'inline'
	end
  
	def getcondition
		host = Rails.application.config.bosch_resthost
		callback= params[:callback]
		headers['Access-Control-Allow-Origin'] = '*'
		headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
		headers['Access-Control-Request-Method'] = '*'
		headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
		release = params[:SCHEMA]
		countryCode = params[:ISO_COUNTRY_CODE]
		page_url = host+'/restService/rest/fetch?callback='+callback+'&data={"tableName":"BOSCH_COND_TPS_CNTRY_'+release+'","columns":["ISO_COUNTRY_CODE","CONDITION_TYPE","DESCRIPTION","NUM_SIGNS"],"predicate":"ISO_COUNTRY_CODE=\''+countryCode+'\' ORDER BY NUM_SIGNS"}'
		url_encoded_string = URI.encode(page_url)
		puts url_encoded_string
		url = URI.parse(url_encoded_string)
		req = Net::HTTP::Get.new(url.to_s)
		res = Net::HTTP.start(url.host, url.port, :read_timeout => 300) {|http|
		   http.request(req)
		}
		send_data res.body, type: res['content-type'], disposition: 'inline'
	end
  
	def gettrafficdesc
		host = Rails.application.config.bosch_resthost
		callback= params[:callback]
		headers['Access-Control-Allow-Origin'] = '*'
		headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
		headers['Access-Control-Request-Method'] = '*'
		headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
		release = params[:SCHEMA]
		countryCode = params[:ISO_COUNTRY_CODE]
		page_url = host+'/restService/rest/fetch?callback='+callback+'&data={"tableName":"BOSCH_SIGN_TPS_CNTRY_'+release+'","columns":["TRAFFIC_SIGN_TYPE","TRAFFIC_SIGN_TYPE","DESCRIPTION","NUM_SIGNS"],"predicate":"ISO_COUNTRY_CODE=\''+countryCode+'\' ORDER BY NUM_SIGNS"}'
		url_encoded_string = URI.encode(page_url)
		puts url_encoded_string
		url = URI.parse(url_encoded_string)
		req = Net::HTTP::Get.new(url.to_s)
		res = Net::HTTP.start(url.host, url.port,:read_timeout => 300) {|http|
		   http.request(req)
		}
		send_data res.body, type: res['content-type'], disposition: 'inline'
	end
end