Vagrant.configure("2") do |config|
  config.vm.box = "sharlak/debian_stretch_64"
  config.vm.network "forwarded_port", guest: 80, host: 8080
  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y nginx curl
    curl -sL https://deb.nodesource.com/setup_8.x | bash -
    apt-get install -y nodejs
    npm i npm@latest -g
  SHELL
end
