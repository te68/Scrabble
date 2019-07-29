Rails.application.routes.draw do
  get 'players/start-new-game', to: "players#start_new_game"
  resources :letters
  resources :players
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
