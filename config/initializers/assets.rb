# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )

Rails.application.config.assets.precompile += [
  "arcgis.js",
  "esri-sync.js",
  "zoom-rectangle.js",
  "rectangle_selection.js",
  "berlin.js",
  "date-time-parser.js",
  "distance-measurement.js",
  "distance-measurement31.js",
  "zoom-control.js",
  "zoom-control31.js",
  "geodesic-polyline.js",
  "gpx-parser.js",
  "jszip.min.js",
  "jszip.js",
  "jszip-utils.js",
  "random-coordinates.js",
  "moment.js",
  "moment-range.js",
  "night-overlay.js",
  "traffic-icons.js",
  "route-match-extension.js",
  "overview.js",
  "overview31.js",
  "arcgis_claro.css",
  "arcgis_esri.css",
  "geofence-extension.js",
  "custom-location-extension-2.js",
  "custom-location-extension-isoline.js",
  "center-utils.js",
  "pde-layer-provider.js",
  "wellknown.js",
  "fleet-connectivity-extension.js",
  "strip2wkt.js",
  "canvasjs.min.js",
  "Chart.bundle.js",
  "tracefile-box.js",
  "warning.js",
  "levels.js",
  "levels_new.js",
  "piexif.js",
  "jsts.min.js",
  "parallel.js",
  "quadkey.js",
  "tooltip.js",
  "PDEGeomUtils.js",
  "geographiclib.js",
  "rlens-0.34.6.min.js",
  "info_bubble_custom_css.css",
  "marker_css.css",
  "InvertedPolygon.js",
  "ClusterMarkerSpider.js",
  "TCSEngineers.js",
  "cebit2017.js",
  "ctxtextpath.js",
  "convexHull.js",
  "hereAccount.js",
  "forward-geocoder.js",
  "forward-geocoder-style.css",
  "costcodata.js",
  "restfulapi_analyzer.js",
  "magnifier.js",
  "restfulapi_analyzer.css",
  "polyline.js",
  "demos/driving_reports.js",
  "demos/pde_adas_curvature_along_route.js",
  "demos/restAPICaller.js",
  "fullscreen.js",
  "kefir.min.js",
  "extension3_1.css",
  "leidos.css"
]
