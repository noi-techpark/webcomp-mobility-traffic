import { Component, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core';
import { NoiAPI } from '@noi/api';
import { selectPathSegmentsIds, selectPathStations } from '@noi/store';
import { urbanPathState } from '@noi/store/path-store';
import { formatDate, formatDuration } from '@noi/utils';
import { translate } from '@noi/lang';

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
  syncDate: Date = undefined;
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
      this.syncDate = segmentsTime.reduce((result, i) => (i.sync && i.sync < result ? i.sync : result), new Date());
      this.highwayTimeMin = Math.round(segmentsTime.reduce((result, i) => { result += i.timeSec; return result;}, 0) / 60);
    } catch (error) {
      alert('TODO: Unable to load A22 path duration');
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
    if (!stations || !stations.length) {
      return null;
    }
    const startPos = stations[0].position; 
    return <div class="content">
      <div class="last-sync">
        <svg class="last-sync__icon" height="19" viewBox="0 0 22 19" width="22" xmlns="http://www.w3.org/2000/svg"><path d="m21.0735024 13.225331 1.5726989 6.9558004-1.9507594.4410646-.837068-3.7041597c-1.610941 3.0425701-4.8017609 5.0451272-8.3825393 5.0451272-4.16390166 0-7.79562527-2.7073911-9.03519719-6.5989573l-.08078759-.2671512 1.92268093-.550725c.91138411 3.1818072 3.83308551 5.4168335 7.19330385 5.4168335 2.6478705 0 5.0258884-1.388028 6.3604911-3.5379024l-3.2760154 1.1010644-.6376431-1.8956295zm-9.5976678-10.225331c4.2433619 0 7.9269849 2.81085725 9.0988916 6.80703642l.0743847.26815018-1.9348492.5063186c-.8539584-3.26332176-3.8158549-5.5815052-7.2384271-5.5815052-2.61342561 0-4.96217966 1.35202102-6.30572101 3.45095608l3.91577739-1.31659528.63764312 1.89562951-7.15083525 2.40536509-1.57269885-6.9558005 1.95075936-.44106455.69822737 3.08753402c1.7258202-2.51882707 4.61873863-4.12602437 7.82684787-4.12602437z" fill="#a2cbde" fill-rule="evenodd" transform="translate(-1 -3)"/></svg>
        {translate('path-details.last-sync')}
        <span class="last-sync__date">{this.syncDate ? formatDate(this.syncDate) : ''}</span>
      </div>
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
              <p><span class="header-highway__title">{translate('path-details.highway-name')}</span> {formatDuration(this.highwayTimeMin)}</p>
            </noi-button>
            : null
          }
          {urbanPathState.durationMin !== undefined  ?
            <noi-button class={urbanHeaderClass} onClick={this.onActivatePath.bind(this, 'urban')}>
              <span class="header-highway__title">{translate('path-details.urban-name')}</span> {formatDuration(urbanPathState.durationMin)}
            </noi-button>
            : null
          }
        </header>
        {this.renderPath()}
      </Host>
    );
  }
}