import { ref } from 'vue';
import { Rive, StateMachineInput } from '@rive-app/webgl';

/**
 * Custom hook for fetching a stateMachine input from a rive file.
 *
 * @param rive - Rive instance
 * @param stateMachineName - Name of the state machine
 * @param inputName - Name of the input
 * @returns
 */
export default function useStateMachineInput(
  rive: Rive | null,
  stateMachineName: string,
  inputName: string
) {
  const input = ref<StateMachineInput | null>(null);

  if (!rive || !stateMachineName || !inputName) {
    input.value = null;
  }

  if (rive && stateMachineName && inputName) {
    const inputs = rive.stateMachineInputs(stateMachineName);
    if (inputs) {
      const selectedInput = inputs.find((input) => input.name === inputName);
      input.value = selectedInput || null;
    }
  } else {
    input.value = null;
  }

  return input;
}
