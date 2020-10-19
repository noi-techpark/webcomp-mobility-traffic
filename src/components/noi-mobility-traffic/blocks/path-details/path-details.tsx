import { Component, h, Host, State } from '@stencil/core';
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

  @State()
  segmentsTime: {[id: string]: number} = null;

  @State()
  highwayTimeMin: number = undefined;
  @State()
  urbanTimeMin: number = undefined;

  async componentDidLoad() {
    const ids = selectPathSegmentsIds();
    try {
      const segmentsTime = await NoiAPI.getSegmentsAvgTime(ids, true);
      this.segmentsTime = segmentsTime.reduce((result, i) => { result[i.id] = i.timeSec; return result;}, {});
      this.highwayTimeMin = Math.round(segmentsTime.reduce((result, i) => { result += i.timeSec; return result;}, 0) / 60);
    } catch (error) {
      alert('TODO: handle error');
    }
  }

  render() {
    const hostClass = {
    };
    const stations = selectPathStations();
    const startPos = stations[0].position; 
    return (
      <Host class={hostClass}>
        <header>
          {this.highwayTimeMin ?
            <div class="header__section">
                <span class="header-highway__title">A22</span> {formatDuration(this.highwayTimeMin)}
            </div>
            : null
          }
          {this.urbanTimeMin ?
            <div class="header__section"></div>
            : null
          }
        </header>
        <div class="content">
          {stations.map(s => <noi-station-item
            name={s.name}
            position={Math.abs(startPos - s.position)}
          ></noi-station-item>)}
        </div>
      </Host>
    );
  }
}