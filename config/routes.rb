Rails.application.routes.draw do

  # Map Tools latest release (json)
  get 'maptools/getlatestrelease' => 'maptools#getlatestrelease'
  # Map Tools list of distributions
  get 'maptools/distributions' => 'maptools#index'
  
  get 'maptools/internal' => 'maptools#internal'
  # Keep /maptools url working
  # Need to use /maptools/distributions because RDF Viewer updater
  # finds new versions from this URL. Not straight forward to update an updater.
  get 'maptools', to: redirect('maptools/distributions')

  # Technical support index
  get 'technical_support' => 'technical_support#index'

  # GDF Viewer index
  get 'gdf' => 'gdf#index'

  # TCS examples specific example
  get 'examples/v3/:id' => 'examples#render_example3'
  # TCS examples index page
  get 'examples' => 'examples#index3'
  
  # TCS examples specific example for 3.1
  get 'examples/v3.1/:id' => 'examples#render_example31'
  get 'examples/v3.1/' => 'examples#index31'

  # PDE index page
  get 'pde/:id' => 'pde#page'
  get 'pde' => 'pde#index'
  
  #Mode SDK index page
  get 'mobilesdk_examples' => 'mobilesdk_examples#index'
  
  get 'login' => "home#login"
  
  
  get 'rest/countryData' => "restapi#countrydata"
  get 'rest/trafficSigns' => "restapi#getdata"
  get 'rest/trafficDescp' => "restapi#gettrafficdesc"
  get 'rest/conditions' => "restapi#getcondition"
  get 'rest/releases' => "restapi#getreleasedata"
  get 'bosch/:id' => 'bosch#render_example3'
  
  post 'AutoClassExtractorInterface/get' => 'restapi#AutoClassExtractorInterface'
  get 'AutoClassExtractorInterface/get' => 'restapi#AutoClassExtractorInterface'
  
  get 'RoadSegmentService/get' => 'restapi#RoadSegmentService'
  get 'proxy' => 'restapi#proxy'

  # Root index page
  root :to => "home#index"
  
  

end
