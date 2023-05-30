module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            timestamp: Date,
            mac_id: String,
            data: Object,
            // metadata: Object,
            wifi_rssi: Number,
            lte_rssi: Number
        },
        {
        timeseries: {
            timeField: 'timestamp',
            metaField: 'metadata',
            granularity: 'seconds'
        }
        // autoCreate: false,
        // expireAfterSeconds: 86400
        }
    ); 

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const RSSI_logs = mongoose.model("RSSI_logs", schema);
    return RSSI_logs;
};