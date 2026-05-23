import type { ComponentType } from 'react';
import ReactInputMask from 'react-input-mask';
import type { Props } from 'react-input-mask';

/** Wrapper tipado: react-input-mask v2 não é compatível com JSX types do React 18. */
const InputMask = ReactInputMask as unknown as ComponentType<Props>;

export default InputMask;
