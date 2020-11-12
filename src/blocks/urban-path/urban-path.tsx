import { Component, h, Host } from '@stencil/core';
import { urbanPathState } from '@noi/store/path-store';
import { translate } from '@noi/lang';

@Component({
  tag: 'noi-urban-path',
  styleUrl: './urban-path.css',
  scoped: true,
})
export class UrbanPathDetails {

  renderContent() {
    if (urbanPathState.loading) {
      return null;
    }
    if (urbanPathState.errorCode) {
      return (<div class="container">
      <p class="error">{translate(urbanPathState.errorCode)}</p>
      </div>);
    }
    if (!urbanPathState.stations || !urbanPathState.stations.length) {
    return (<div class="container">
      <p class="empty">{translate('path-details.urban-empty')}</p>
    </div>)
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