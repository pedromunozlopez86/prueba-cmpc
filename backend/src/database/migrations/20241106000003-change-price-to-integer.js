"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Cambiar el tipo de dato de price de DECIMAL a INTEGER para pesos chilenos (CLP)
    await queryInterface.changeColumn("books", "price", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir a DECIMAL si es necesario
    await queryInterface.changeColumn("books", "price", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });
  },
};
