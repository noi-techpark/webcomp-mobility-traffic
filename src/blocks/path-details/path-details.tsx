// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { translate } from '@noi/lang';
import { selectPathStations } from '@noi/store';
import { pathState } from '@noi/store/path.store';
import { urbanPathState } from '@noi/store/urban-path.store';
import { formatDate, formatDuration, getBrowserUTCOffsetMs } from '@noi/utils';
import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';

const offsetMs = getBrowserUTCOffsetMs();
@Component({
  tag: 'noi-path-details',
  styleUrl: './path-details.css',
  scoped: true,
})
export class PathDetails {
  @State()
  activePath: 'highway' | 'urban' = 'highway';
  @Event()
  toggleActive: EventEmitter<'urban' | 'highway'>;

  onActivatePath(value: 'highway' | 'urban') {
    this.toggleActive.emit(value);
    this.activePath = value;
  }

  renderHighwayPathError() {
    if (!pathState.pathError) {
      return null;
    }
    return (
      <div class="container">
        <p class="error">{translate(pathState.pathError)}</p>
      </div>
    );
  }

  renderHighwayDetails() {
    if (pathState.errorCode) {
      return (
        <div class="container">
          <p class="error">{translate(pathState.errorCode)}</p>
        </div>
      );
    }
    const lastSync = (<noi-last-sync syncDate={pathState.syncDate}></noi-last-sync>)
    return [
      lastSync,
      this.renderHighwayPathError()
    ];
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
    const contentInnerClass = {
      'content__inner': true,
      'content__inner--error': !!pathState.pathError && !!pathState.syncDate
    };
    const segmentsTime = pathState.segmentsTime || {};
    return <div class="content">
      <div class={contentInnerClass}>
        {this.renderHighwayDetails()}
        {stations.map((s, i) => <noi-station-item
          name={s.name}
          position={Math.abs(startPos - s.position)}
          timeSec={i === 0 ? undefined : Math.round(segmentsTime[`${stations[i-1].id}-${s.id}`])}
          isStart={!!s.isStart}
          isEnd={!!s.isEnd}
        ></noi-station-item>)}
        </div>
    </div>;
  }

  renderUrbanHeaderTab() {
    const urbanHeaderClass = {
      'header__section': true,
      'header__section--active': this.activePath === 'urban',
      'header__section--err': !!urbanPathState.errorCode
    };
    if (urbanPathState.durationMin !== undefined) {
      return (
        <noi-button class={urbanHeaderClass} onClick={this.onActivatePath.bind(this, 'urban')}>
          <span class="header-highway__title">{translate('path-details.urban-name')}</span> {formatDuration(urbanPathState.durationMin)}
        </noi-button>
      );
    }
    if (urbanPathState.errorCode) {
      return (
        <noi-button class={urbanHeaderClass} onClick={this.onActivatePath.bind(this, 'urban')}>
          <span class="header-highway__title">{translate('path-details.urban-name')}</span>
          {translate('path-details.urban-error')}
        </noi-button>
      );
    }
    if (urbanPathState.loading) {
      return (
        <noi-button disabled class={urbanHeaderClass}>
          <span class="header-highway__title">{translate('path-details.urban-name')}</span>
          {translate('path-details.urban-loading')}
        </noi-button>
      );
    }
    return (
      <noi-button disabled class={urbanHeaderClass}>
        <span class="header-highway__title">{translate('path-details.urban-name')}</span>
      </noi-button>
    );
  }

  renderA22HeaderTab() {
    const highwayHeaderClass = {
      'header__section': true,
      'header__section--active': this.activePath === 'highway',
      'header__section--err': !!pathState.errorCode
    };
    if (pathState.durationMin !== undefined) {
      return (
        <noi-button class={highwayHeaderClass} onClick={this.onActivatePath.bind(this, 'highway')}>
        <p><span class="header-highway__title">{translate('path-details.highway-name')}</span> {formatDuration(pathState.durationMin)}</p>
      </noi-button>);
    }
    if (pathState.errorCode) {
      return (
        <noi-button class={highwayHeaderClass} onClick={this.onActivatePath.bind(this, 'highway')}>
          <span class="header-highway__title">{translate('path-details.highway-name')}</span>
          <span class="header-highway__icon">&#9888;</span>
        </noi-button>
      );
    }
    if (pathState.loading) {
      return (
        <noi-button disabled class={highwayHeaderClass}>
          <span class="header-highway__title">{translate('path-details.highway-name')}</span>
          {translate('path-details.highway-loading')}
        </noi-button>
      );
    }
    return (
      <noi-button disabled class={highwayHeaderClass}>
        <span class="header-highway__title">{translate('path-details.highway-name')}</span>
      </noi-button>
    );
  }

  render() {
    const hostClass = {
    };
    return (
      <Host class={hostClass}>
        <header>
          {this.renderA22HeaderTab()}
          {this.renderUrbanHeaderTab()}
        </header>
        {this.renderPath()}
      </Host>
    );
  }
}