class BoschController < ApplicationController

  def render_example3
    render :template => "bosch/" + params[:id]
  end

end
