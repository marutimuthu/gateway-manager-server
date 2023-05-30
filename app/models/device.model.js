module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      // user_id: {
      //     type: mongoose.Schema.Types.ObjectId,
      //     required: true,
      //     ref: 'User' //relation betwen the device and the user
      // },
      id: String,
      name: String,
      gateway_type: Number,
      status: String,
      location: String,
      zone: String,
      hardware: String, // Gateway Hardware e.g. 4GW-D
      modules: String, // External Slaves
      firmware_version: String,
      mac_id: String,
      bootup_time: Number,
      gateway_time: Number,
      rtc_status: Number,
      network_mode: String, // Wifi / Ethernet
      wifi_status: Number,
      wifi_rssi: Number,
      wifi_ssid: String,
      wifi_pass: String,
      wifi_reconnections: String,
      eth_status: Number,
      eth_reconnections: Number,
      dhcp: Number,
      ip: String,
      gateway: String,
      subnet: String,
      dns1: String,
      dns2: String,
      mode_routes: Number,
      lte_status: String,
      lte_apn: String,
      lte_operator: String,
      lte_ip: String,
      lte_rssi: String,
      lte_reconnections: Number,

      // Add
      mqtt_clientid: String,
      mqtt_url: String,
      mqtt_user: String,
      mqtt_pass: String,
      mqtt_status: Number,

      // Remove
      mqtt_wifi_url: String,
      mqtt_wifi_user: String,
      mqtt_wifi_pass: String,
      mqtt_wifi_status: Number,
      mqtt_lte_status: Number,
      mqtt_lte_url: String,
      mqtt_lte_user: String,
      mqtt_lte_pass: String,
      lte_mode: Number,

      https_api: String,
      https_backup_api: String,
      schedule_restart_enable: Number,
      schedule_restart_hour: Number,
      schedule_restart_minute: Number,
      schedule_restart_second: Number,

      // Add
      in_interval: String,
      in1_mode: String,
      in1_slope: String,
      in1_offset: String,
      in2_mode: String,
      in2_slope: String,
      in2_offset: String,

      mb_mode: Number,
      mb_interval: Number,
      mb_timeout: Number,
      baud: Number,
      data_bits: Number,
      parity: String,
      stop_bits: String,
      mb_ip: String,
      mb_port: Number,
      query: String,
      mb_address_map: Array,
      http_refresh_interval_mins: Number,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Device = mongoose.model("Device", schema);
  return Device;
};