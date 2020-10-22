import { Component, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core';
import { NoiAPI } from '@noi/api';
import { selectPathSegmentsIds, selectPathStations } from '@noi/store';
import { urbanPathState } from '@noi/store/path-store';
import { formatDuration } from 'src/utils';

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

  @Event()
  toggleActive: EventEmitter<'urban' | 'highway'>;

  async componentDidLoad() {
    await this.updateState();
  }

  @Watch('startId')
  async updateStart(_, oldValue) {
    if (!!oldValue) {
      await this.updateState();
    }
  }

  @Watch('endId')
  async updateStop(_, oldValue) {
    if (!!oldValue) {
      await this.updateState();
    }
  }

  async updateState() {
    this.highwayTimeMin = undefined;
    this.segmentsTime = undefined;
    const highwayPath = selectPathSegmentsIds();
    try {
      const segmentsTime = await NoiAPI.getLinkStationsTime(highwayPath, true);
      this.segmentsTime = segmentsTime.reduce((result, i) => { result[i.id] = i.timeSec; return result;}, {});
      this.highwayTimeMin = Math.round(segmentsTime.reduce((result, i) => { result += i.timeSec; return result;}, 0) / 60);
    } catch (error) {
      alert('TODO: handle error');
    }
  }


  onActivatePath(value: 'highway' | 'urban') {
    this.toggleActive.emit(value);
    this.activePath = value;
  }

  renderPath() {
    if (this.activePath === 'urban') {
      return <noi-urban-path></noi-urban-path>
    }
    const stations = selectPathStations();
    const startPos = stations[0].position; 
    return <div class="content">
      {stations.map(s => <noi-station-item
        name={s.name}
        position={Math.abs(startPos - s.position)}
        isStart={!!s.isStart}
        isEnd={!!s.isEnd}
      ></noi-station-item>)}
    </div>;
  }


  render() {
    const hostClass = {
    };
    
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
          {urbanPathState.distance !== undefined  ?
            <noi-button class={urbanHeaderClass} onClick={this.onActivatePath.bind(this, 'urban')}>
              <span class="header-highway__title">SS</span> {(urbanPathState.distance / 1000).toFixed(1) + 'km'}
            </noi-button>
            : null
          }
        </header>
        {this.renderPath()}
      </Host>
    );
  }
}