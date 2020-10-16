import { Component, h, Host, State } from '@stencil/core';
import { NoiAPI } from '@noi/api';
import { selectPathSegmentsIds, selectPathStations } from '@noi/store';

@Component({
  tag: 'noi-path-details',
  styleUrl: './path-details.css',
  scoped: true,
})
export class PathDetails {

  @State()
  segmentsTime: {[id: string]: number} = null;

  @State()
  highwayTime: number;

  async componentDidLoad() {
    const ids = selectPathSegmentsIds();
    try {
      const segmentsTime = await NoiAPI.getSegmentsAvgTime(ids, true);
      this.segmentsTime = segmentsTime.reduce((result, i) => { result[i.id] = i.timeSec; return result;}, {});
      this.highwayTime = Math.round(segmentsTime.reduce((result, i) => { result += i.timeSec; return result;}, 0) / 60);
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
          <div class="header__highway">
            <span class="header-highway__title">A22</span> {this.highwayTime} min
          </div>
          <div class="header__urban"></div>
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