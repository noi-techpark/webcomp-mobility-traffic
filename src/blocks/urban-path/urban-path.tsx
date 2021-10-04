import { Component, h, Host } from '@stencil/core';
import { urbanPathState } from '@noi/store/urban-path.store';
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
    const content = urbanPathState.stations.map((s, i) => <noi-station-item
      name={translate(`link-station.${s.id}`)}
      position={s.position}
      timeSec={s.timeSec}
      isStart={i === 0}
      isSelected={urbanPathState.selectedId === s.id}
      onClick={this.onStationClick.bind(this, s.id)}
    ></noi-station-item>)
    const lastSync = (<noi-last-sync syncDate={urbanPathState.syncDate}></noi-last-sync>)
    return [lastSync, content]
  }

  onStationClick(id: string) {
    urbanPathState.selectedId = id;
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