interface Navigator {
  /**
   * Vibrates the device for the specified amount of time.
   * @param time Milliseconds to vibrate the device. 0 cancels the vibration. Ignored on iOS.
   */
  vibrate(time: number): void;

  /**
   * Vibrates the device with a given pattern.
   * @param time Sequence of durations (in milliseconds) for which to turn on or off the vibrator. Ignored on iOS.
   */
  vibrate(time: number[]): void;
}
