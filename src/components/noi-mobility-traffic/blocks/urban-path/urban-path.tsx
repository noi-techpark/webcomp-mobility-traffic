import { Component, h, Host, Prop, State, Watch } from '@stencil/core';
import { NoiAPI, NoiLinkStation } from '@noi/api';
import noiStore from '@noi/store';
import { NoiError } from '@noi/api/error';

@Component({
  tag: 'noi-urban-path',
  styleUrl: './urban-path.css',
  scoped: true,
})
export class UrbanPathDetails {
  @Prop()
  startId!: string;
  @Prop()
  endId!: string;

  @State()
  urbanPath: string[] = undefined;
  @State()
  errorCode: string = undefined;
  @State()
  urbanStations: NoiLinkStation[] = undefined;
  @State()
  segments: {name: string, position: number}[] = undefined;

  render() {
    const hostClass = {
    };
    return (
      <Host class={hostClass}>
        <div class="content">
          {this.segments.map((s, i) => <noi-station-item
            name={s.name}
            position={s.position}
            isStart={i === 0}
            isEnd={i === this.segments.length-1}
          ></noi-station-item>)}
        </div>
      </Host>
    );
  }
}