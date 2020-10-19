import { Component, h, Host, Prop, State, Watch } from '@stencil/core';
import { NoiAPI } from '@noi/api';
import { selectPathSegmentsIds, selectPathStations } from '@noi/store';


function  formatDuration(valueMin: number): string {
  const h = Math.floor(valueMin / 60);
  const min = (valueMin % 60);
  return h ? `${h} h ${min} min` : `${min} min`;
}

@Component({
  tag: 'noi-path-details',
  styleUrl: './path-details.css',
  scoped: true,
})
export class PathDetails {
  @Prop()
  startId!: string;
  @Prop()
  endId!: string;

  @State()
  segmentsTime: {[id: string]: number} = undefined;
  @State()
  activePath: 'highway' | 'urban' = 'highway';
  @State()
  highwayTimeMin: number = undefined;
  @State()
  urbanTimeMin: number = 121;

  async componentDidLoad() {
    await this.updateState();
  }

  @Watch('startId')
  @Watch('endId')
  async updateStartStop(_, oldValue) {
    if (!!oldValue) {
      await this.updateState();
    }
  }

  async updateState() {
    this.highwayTimeMin = undefined;
    this.segmentsTime = undefined;
    const ids = selectPathSegmentsIds();
    try {
      const segmentsTime = await NoiAPI.getSegmentsAvgTime(ids, true);
      this.segmentsTime = segmentsTime.reduce((result, i) => { result[i.id] = i.timeSec; return result;}, {});
      this.highwayTimeMin = Math.round(segmentsTime.reduce((result, i) => { result += i.timeSec; return result;}, 0) / 60);
    } catch (error) {
      alert('TODO: handle error');
    }
  }

  onActivatePath(value: 'highway' | 'urban') {
    this.activePath = value;
  }

  render() {
    const hostClass = {
    };
    const stations = selectPathStations();
    const startPos = stations[0].position; 
    const highwayHeaderClass = {
      'header__section': true,
      'header__section--active': this.activePath === 'highway'
    };
    const urbanHeaderClass = {
      'header__section': true,
      'header__section--active': this.activePath === 'urban'
    };
    return (
      <Host class={hostClass}>
        <header>
          {this.highwayTimeMin ?
            <noi-button class={highwayHeaderClass} onClick={this.onActivatePath.bind(this, 'highway')}>
              <p><span class="header-highway__title">A22</span> {formatDuration(this.highwayTimeMin)}</p>
            </noi-button>
            : null
          }
          {this.urbanTimeMin !== undefined  ?
            <noi-button class={urbanHeaderClass} onClick={this.onActivatePath.bind(this, 'urban')}>
              <span class="header-highway__title">SS</span> {formatDuration(this.urbanTimeMin)}
            </noi-button>
            : null
          }
        </header>
        <div class="content">
          {stations.map(s => <noi-station-item
            name={s.name}
            position={Math.abs(startPos - s.position)}
            isStart={!!s.isStart}
            isEnd={!!s.isEnd}
          ></noi-station-item>)}
        </div>
      </Host>
    );
  }
}