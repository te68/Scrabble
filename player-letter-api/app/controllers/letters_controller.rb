class LettersController < ApplicationController

  def index
    letters = Letter.all
    render json: letters, only: [:id, :name, :value, :player_id]
  end

  def show
    letter = Letter.find_by(id: params[:id])
    render json: letter, only: [:id, :name, :value, :player_id]
  end

  def create
  end

  def destroy
    letter = Letter.find_by(id: params[:id])
    letter.destroy
  end

end
