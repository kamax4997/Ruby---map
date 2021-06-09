class MobilesdkExamplesController < ApplicationController
  def index
    # load configuration file into JSON object
    conf_file_sdk = File.read(File.join(Rails.root, 'config', 'sdk_examples.json'))
    @examples_json_sdk = JSON.parse(conf_file_sdk)
  end
end
