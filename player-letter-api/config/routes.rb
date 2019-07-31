Rails.application.routes.draw do
  post 'players/start-new-game', to: "players#start_new_game"
  post 'players/draw_replacements', to: "players#draw_replacements"
  resources :letters
  resources :players
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
