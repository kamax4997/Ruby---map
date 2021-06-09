class MaptoolsController < ApplicationController

  def index
    @maptools_version = Dir.glob(Rails.application.config.maptools_versions + "/*").sort.reverse
    @maptools_versions_ci = Dir.glob(Rails.application.config.maptools_versions_ci + "/*").sort.reverse
    @maptools_docs = Dir.glob(Rails.application.config.maptools_docs + "/*").sort.reverse
	@rdf_installer = Dir.glob(Rails.application.config.rdf_installer + "/*").sort.reverse
	@rdf_clipper = Dir.glob(Rails.application.config.rdf_clipper + "/*").sort.reverse
  end
  
   def internal
    @maptools_version = Dir.glob(Rails.application.config.maptools_versions_internal + "/*").sort.reverse
  end

  def getlatestrelease
    latest = Dir.entries(Rails.application.config.maptools_versions).sort.last[/Map_Tools_([0-9]+)\.zip/,1]
    render json: {:latestRelease => latest}
  end

  def getlatestdocs
    latestdocs = Dir.entries(Rails.application.config.maptools_docs).sort.last[/Map_Tools_([Docs_]*)([0-9]+)\.zip/,1]
    render json: {:latestRelease => latestdocs}
  end
end
