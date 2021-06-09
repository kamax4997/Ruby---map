# config valid only for current version of Capistrano
lock '3.4.0'

set :application, 'tcs-site'
set :deploy_user, 'deploy'

# deploy to /home/user/www/application
set :deploy_to, '/home/deploy/www/tcs-site'

# url of the repository to download TCS sites code
#set :repo_url, 'https://enterprise-platform-bot:73nrxlvn@deveo.in.here.com/HERE/projects/tcs-sites/repositories/git/tcs-sites'
#migrating 29.1.2021
set :repo_url, 'ssh://git@main.gitlab.in.here.com:3389/technical-support/tcs-sites/site.git'


# share maptools_versions between deploys
# makes symlink current/public/maptools/distributions -> shared/public/maptools/distributions
set :linked_dirs, %w{ public/maptools/distributions public/maptools/internal  public/maptools/ci public/others public/maptools/docs public/maptools/rdfinstaller public/maptools/rdfclipper}

set :keep_releases, 2

namespace :deploy do

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      execute :touch, release_path.join('tmp/restart.txt')
    end
  end

  after :published, 'deploy:restart'
  after :finished, 'deploy:cleanup'
end
