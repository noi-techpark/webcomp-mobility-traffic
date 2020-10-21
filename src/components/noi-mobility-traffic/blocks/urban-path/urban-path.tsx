import { Component, h, Host } from '@stencil/core';
import { urbanPathState } from '@noi/store/path-store';

@Component({
  tag: 'noi-urban-path',
  styleUrl: './urban-path.css',
  scoped: true,
})
export class UrbanPathDetails {

  renderContent() {
    if (urbanPathState.loading) {
      return (<div>Loading...</div>);
      // TODO:
    }
    if (urbanPathState.errorCode) {
      return (<div>Error {urbanPathState.errorCode}</div>);
      // TODO:
    }
    if (!urbanPathState.stations || !urbanPathState.stations.length) {
      return (<div>No path</div>)
    }
    return urbanPathState.stations.map((s, i) => <noi-station-item
      name={s.name}
      position={s.position}
      isStart={i === 0}
    ></noi-station-item>)
  }

  render() {
    const hostClass = {
    };
    return (
      <Host class={hostClass}>
        <div class="content">
          {this.renderContent()}
        </div>
      </Host>
    );
  }
}