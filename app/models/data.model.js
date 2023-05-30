module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            timestamp: Date,
            mac_id: String,
            data: Object
            // metadata: Object,
            // ec: Number,
            // ph: Number,
            // temp: Number,
            // humidity: Number,
            // lights: Boolean,
            // pump: Boolean
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

    const Data = mongoose.model("data", schema);
    return Data;
};