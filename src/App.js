import React, { useEffect } from 'react';

const context = new AudioContext();

export const onPress = ({ config }) => {
  const o = context.createOscillator();
  const g = context.createGain();
  o.type = config.waveform || "sine";
  o.frequency.value = config.frequency || 100;
  o.connect(g);
  g.connect(context.destination);
  o.start(0)
  g.gain.exponentialRampToValueAtTime(config.ramp || 1.0, context.currentTime + 2)
  o.stop(context.currentTime + 2);
}

const App = ({ config, setConfig }) => {

  const onChange = (event) => {
    console.log(event.target.name, event.target.value);
    setConfig({ ...config, [event.target.name]: event.target.value });
  }

  return (
    <div style={{ height: "100%", background: "pink"}} >
      <div style={{ padding: "2em" }}>
        <h3>soundq plugin</h3>
        <div className="settings">
          <div className="setting">
            <label htmlFor="waveform">waveform: </label>
            <select required name="waveform" onChange={onChange} value={config.waveform || ""}>
              <option value="" disabled hidden>sine</option>
              <option value="sine">sine</option>
              <option value="square">square</option>
              <option value="sawtooth">sawtooth</option>
              <option value="triangle">triangle</option>
            </select>
          </div>
          <div className="setting">
            <label htmlFor="frequency">frequency: </label>
            <input type="text" name="frequency" placeholder="403" onChange={onChange} value={config.frequency || ""} />
          </div>
          <div className="setting">
            <label htmlFor="ramp">exponential ramp: </label>
            <input type="text" name="ramp" placeholder="1.0" onChange={onChange} value={config.ramp || ""} />
          </div>
        </div>
      </div>
    </div>
  )
};

export default App;
