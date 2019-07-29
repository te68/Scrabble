class PlayerSerializer

def initialize(player_object)
  @player = player_object
end

def to_serialized_json
  object = {
    include: {
      letters:{
        only: [:name, :value]
      }
    },
    except: [:updated_at, :created_at]
  }
  @player.to_json(object)
end

end
