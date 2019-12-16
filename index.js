"use strict";

const express = require('express');

var Service, Characteristic, HomebridgeAPI;

module.exports = function(homebridge) {
  console.log('Initializing registration');
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  HomebridgeAPI = homebridge;
  homebridge.registerAccessory("homebridge-controller", "HomebridgeController", HomebridgeController);
  console.log('Registrated');
}

function HomebridgeController(log, config) {
  this.log = log;
  this.name = config.name;

  this.services = [];
  //this.buttons = [];

  /*
  var app = express();
  app.listen(config.port, () => console.log('Server started'));

  app.get('/info', (req, res) => {
    res.status(200).json({status:"ok"});
  });

  app.get('/:id', (req, res) => {
    this.buttons[req.params.id]
      .getCharacteristic(Characteristic.ProgrammableSwitchEvent)
      .setValue(Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS);
    res.status(200).json({status:"ok"});
  });
  */

  const informationService = new Service.AccessoryInformation();
  informationService
    .setCharacteristic(Characteristic.Manufacturer, "XNOR Software")
    .setCharacteristic(Characteristic.Model, "Homebridge Controller")
    .setCharacteristic(Characteristic.SerialNumber, "3.33.333")
    .setCharacteristic(Characteristic.FirmwareRevision, '1.0.0');
  this.services.push(informationService);

  const batteryService = new Service.BatteryService(this.name)
  batteryService
    .setCharacteristic(Characteristic.ChargingState, Characteristic.ChargingState.NOT_CHARGEABLE)
    .setCharacteristic(Characteristic.BatteryLevel, 33)
    .setCharacteristic(Characteristic.StatusLowBattery, Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL);
  this.services.push(batteryService);
	
  const labelService = new Service.ServiceLabel(this.name);
  labelService
    .getCharacteristic(Characteristic.ServiceLabelNamespace)
    .setValue(Characteristic.ServiceLabelNamespace.ARABIC_NUMERALS);
  this.services.push(labelService);

  const SINGLE = {
    minValue: Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS,
    maxValue: Characteristic.ProgrammableSwitchEvent.LONG_PRESS
  }

  for (var i = 0; i < config.buttons.length; i++) {
    this.services.push(this.createButton(i+1, config.buttons[i].name, config.buttons[i].icon, SINGLE));
  }
  //this.services.push(this.createButton(2, 'Dim Up', SINGLE));
  //this.services.push(this.createButton(3, 'Dim Down', SINGLE));
  //this.services.push(this.createButton(4, 'Off', SINGLE));
}

HomebridgeController.prototype.createButton = function (buttonIndex, buttonName, buttonIcon, props) {
  const service = new Service.StatelessProgrammableSwitch(buttonName, buttonName);
  //this.buttons[buttonIndex - 1] = service
  service.getCharacteristic(Characteristic.ProgrammableSwitchEvent)
    .setProps(props);
  service.getCharacteristic(Characteristic.ServiceLabelIndex)
    .setValue(buttonIndex);
  service.getCharacteristic(Characteristic.ConfiguredName).setValue(buttonIcon);
  return service;
}

HomebridgeController.prototype.getServices = function() {
  return this.services;
}