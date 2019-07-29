class CreateLetters < ActiveRecord::Migration[5.2]
  def change
    create_table :letters do |t|
      t.string :name
      t.integer :value
      t.belongs_to :player, foreign_key: true

      t.timestamps
    end
  end
end
