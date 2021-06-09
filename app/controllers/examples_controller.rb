class ExamplesController < ApplicationController
  
  def index3
    # load configuration file into JSON object
    conf_file = File.read(File.join(Rails.root, 'config', 'tcs_examples3.json'))
    @examples_json = JSON.parse(conf_file)
  end

  def index31
    # load configuration file into JSON object
    conf_file = File.read(File.join(Rails.root, 'config', 'tcs_examples31.json'))
    @examples_json = JSON.parse(conf_file)
  end

  def render_example3
    # check if example is china related to load the respective js file in
	# application.html.erb
     page_url = request.original_url
	 @is_china_example = "false"
	 if(page_url.include? "fleet_china")
		@is_china_example = "true"
	 end
    # check the folder ../views/examples/v3
    render :template => "examples/v3/" + params[:id]
  end
  
  def render_example31
    render :template => "examples/v3.1/" + params[:id]
  end

end
