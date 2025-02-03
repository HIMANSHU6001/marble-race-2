declare module 'react-nipple' {
  import { Component } from 'react';

  interface NippleProps {
    options?: any;
    style?: React.CSSProperties;
    onMove?: (evt: any, data: any) => void;
    onEnd?: (evt: any, data: any) => void;
  }

  export default class Nipple extends Component<NippleProps> {}
}