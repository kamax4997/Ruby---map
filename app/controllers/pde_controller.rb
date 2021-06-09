require 'faraday'

class PdeController < ApplicationController


  ########### Routes ###########

  def index
  end

  def page
    req_url = 'doc/' + params[:id] + '.json'
    @json = pde_request(req_url, params)

    render :template => 'pde/' + params[:id]
  end

  ########## Functions #########

  def pde_request(url, params)
    conn = pde_connection(params[:url_root])

    response = conn.get do |req|
      req.url url
      req.params['app_id']   = Rails.application.config.app_id
      req.params['app_code'] = Rails.application.config.app_code

      if params.has_key?(:region)
        req.params['region'] = params[:region]
      end

      if params.has_key?(:release)
        req.params['release'] = params[:release]
      end

      if params.has_key?(:content)
        req.params['content'] = params[:content]
      end

      if params.has_key?(:layer)
        req.params['layer'] = params[:layer]
      end

      if params.has_key?(:detail)
        req.params['detail'] = params[:detail]
      end
    end

    return JSON.parse(response.body)
  end

  def pde_connection(url_root)
    # Return a connection to the PDE service
    return Faraday.new(:url => "http://" + url_root + "/1/") do |r|
      r.request  :url_encoded             # form-encode POST params
      r.response :logger                  # log requests to STDOUT
      r.adapter  Faraday.default_adapter  # make requests with Net::HTTP
    end
  end
end
