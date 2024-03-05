import { useState } from "react";
import Switch from "react-switch";


type CustomToggleSwitchProps = {
  isTimerOn: boolean;
  onToggle: any;
  onInput?: any;
  checked?: boolean;
  containerStyle?: any;
  labelStyle?: any;
  offState?: any;
  onState?: any;
}

export const CustomToggleSwitch = ({ isTimerOn, onToggle, onInput, checked, containerStyle, labelStyle, offState, onState }: CustomToggleSwitchProps) => {
  return (
    <div className={containerStyle}>
      <label className={labelStyle}>Timer {isTimerOn ? 'On' : 'Off'}</label>
      <Switch
        checked={checked ? checked : isTimerOn}
        onColor='#00ff00' // green
        offColor='#ff0000' // red
        width={200}
        onChange={isOn => {
          onToggle(isOn)
        }}
        disabled={false}
      />
      {isTimerOn && (
        <input 
          type="text" 
          onChange={(e) => onInput(e.target.value)}
          placeholder={"Enter value for timer"}
        />
      )}
    </div>
  )
};