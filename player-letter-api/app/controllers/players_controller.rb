class PlayersController < ApplicationController

def index
  players = Player.all
  render json: PlayerSerializer.new(players).to_serialized_json
end

def show
  player = Player.find_by(id: params[:id])
  render json: PlayerSerializer.new(player).to_serialized_json
end

def create
  nameArray = params[:name].split(",")
  nameArray.each do |name|
    Player.create!(name: name, score: 0)
  end
end

def start_new_game
  Letter.delete_all()
  Player.all.each do |player|
    if player.id != 1
      player.destroy()
    end
  end
  createLetters()
end

def createLetters
  tilea  = {name: "A", value: 1, player_id: 1}
  tileb  = {name: "B", value: 3, player_id: 1}
  tilec  = {name: "C", value: 2, player_id: 1}
  tiled  = {name: "D", value: 2, player_id: 1}
  tilee  = {name: "E", value: 1, player_id: 1}
  tilef  = {name: "F", value: 4, player_id: 1}
  tileg  = {name: "G", value: 2, player_id: 1}
  tileh  = {name: "H", value: 4, player_id: 1}
  tilei  = {name: "I", value: 1, player_id: 1}
  tilej  = {name: "J", value: 8, player_id: 1}
  tilek  = {name: "K", value: 5, player_id: 1}
  tilel  = {name: "L", value: 1, player_id: 1}
  tilem  = {name: "M", value: 3, player_id: 1}
  tilen  = {name: "N", value: 1, player_id: 1}
  tileo  = {name: "O", value: 1, player_id: 1}
  tilep  = {name: "P", value: 3, player_id: 1}
  tileq  = {name: "Q", value: 10, player_id: 1}
  tiler  = {name: "R", value: 1, player_id: 1}
  tiles  = {name: "S", value: 1, player_id: 1}
  tilet  = {name: "T", value: 1, player_id: 1}
  tileu  = {name: "U", value: 1, player_id: 1}
  tilev  = {name: "V", value: 4, player_id: 1}
  tilew  = {name: "W", value: 4, player_id: 1}
  tiley  = {name: "Y", value: 4, player_id: 1}
  tilex  = {name: "X", value: 8, player_id: 1}
  tilez  = {name: "Z", value: 10, player_id: 1}
  9.times { Letter.create(tilea) }
  2.times { Letter.create(tileb) }
  2.times { Letter.create(tilec) }
  4.times { Letter.create(tiled) }
  1.times { Letter.create(tilee) }
  2.times { Letter.create(tilef) }
  3.times { Letter.create(tileg) }
  2.times { Letter.create(tileh) }
  9.times { Letter.create(tilei) }
  1.times { Letter.create(tilej) }
  1.times { Letter.create(tilek) }
  4.times { Letter.create(tilel) }
  2.times { Letter.create(tilem) }
  6.times { Letter.create(tilen) }
  8.times { Letter.create(tileo) }
  2.times { Letter.create(tilep) }
  1.times { Letter.create(tileq) }
  6.times { Letter.create(tiler) }
  4.times { Letter.create(tiles) }
  6.times { Letter.create(tilet) }
  4.times { Letter.create(tileu) }
  2.times { Letter.create(tilev) }
  2.times { Letter.create(tilew) }
  1.times { Letter.create(tiley) }
  2.times { Letter.create(tilex) }
  1.times { Letter.create(tilez) }
end


end
