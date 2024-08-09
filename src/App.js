import React, { useEffect } from "react";

const context = new AudioContext();

export const onPress = ({ config }) => {
    // Create Nodes
    const osc = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();

    filter.frequency.setValueAtTime(config.filterFreq, context.currentTime, 0);
    gain.gain.setValueAtTime(config.gain, context.currentTime);
    osc.type = config.waveform || "sine";
    osc.frequency.value = config.frequency || 100;

    // Connect Nodes
    osc.connect(filter);
    filter.connect(context.destination);
    osc.connect(gain);
    gain.connect(context.destination);

    // Play
    osc.start(0);
    // g.gain.exponentialRampToValueAtTime(
    //     config.ramp || 1.0,
    //     context.currentTime + 2
    // );
    osc.stop(context.currentTime + 2);
};

const App = ({ config, setConfig }) => {
    const onChange = (event) => {
        console.log(event.target.name, event.target.value);
        setConfig({ ...config, [event.target.name]: event.target.value });
    };

    return (
        <div style={{ height: "100%", background: "pink" }}>
            <div style={{ padding: "2em" }}>
                <h3>SoundQ Oscillator Plugin</h3>
                <div className="settings">
                    <div className="setting">
                        <label htmlFor="waveform">Waveform: </label>
                        <select
                            required
                            name="waveform"
                            onChange={onChange}
                            value={config.waveform || ""}
                        >
                            <option value="" disabled hidden>
                                sine
                            </option>
                            <option value="sine">sine</option>
                            <option value="square">square</option>
                            <option value="sawtooth">sawtooth</option>
                            <option value="triangle">triangle</option>
                        </select>
                    </div>
                    {/* Filter Type Select */}
                    <div className="setting">
                        <label htmlFor="filterType">Filter Type: </label>
                        <select
                            required
                            name="filterType"
                            onChange={onChange}
                            value={config.filterType || ""}
                        >
                            <option value="" disabled hidden>
                                lowpass
                            </option>
                            <option value="lowpass">Low Pass</option>
                            <option value="highpass">High Pass</option>
                            <option value="bandpass">Band Pass</option>
                            <option value="lowshelf">Low Shelf</option>
                        </select>
                    </div>
                    {/* Oscilliator Freq */}
                    <div className="setting">
                        <label htmlFor="frequency">Frequency: </label>
                        <input
                            type="number"
                            name="frequency"
                            placeholder="403"
                            onChange={onChange}
                            value={config.frequency || ""}
                        />
                    </div>
                    {/* Filter Freq Select */}
                    <div className="setting">
                        <label htmlFor="filterFreq">Filter Freq: </label>
                        <input
                            type="range"
                            name="filterFreq"
                            min="30"
                            max="1000"
                            step="1"
                            onChange={onChange}
                            value={config.filterFreq || 1.0}
                        />
                        {parseFloat(config.filterFreq || 1.0).toFixed(0)}
                        {/* <input type="number" name="ramp" placeholder="1.0" onChange={onChange} value={config.ramp || ""} /> */}
                    </div>
                    <div className="setting">
                        <label htmlFor="ramp">Ramp: </label>
                        <input
                            type="range"
                            name="ramp"
                            min="0.0001"
                            max="1"
                            step="0.0001"
                            onChange={onChange}
                            value={config.ramp || 1.0}
                        />
                        {parseFloat(config.ramp || 1.0).toFixed(4)}
                        {/* <input type="number" name="ramp" placeholder="1.0" onChange={onChange} value={config.ramp || ""} /> */}
                    </div>
                    <div className="setting">
                        <label htmlFor="ramp">Gain: </label>
                        <input
                            type="range"
                            name="gain"
                            min="0.0001"
                            max="1"
                            step="0.0001"
                            onChange={onChange}
                            value={config.gain || 1.0}
                        />
                        {parseFloat(config.gain || 1.0).toFixed(4)}
                        {/* <input type="number" name="ramp" placeholder="1.0" onChange={onChange} value={config.ramp || ""} /> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
