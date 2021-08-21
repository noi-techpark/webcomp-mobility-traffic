import { translate } from '@noi/lang';
import { formatDate, getBrowserUTCOffsetMs } from '@noi/utils';
import { Component, h, Host, Prop } from '@stencil/core';

const offsetMs = getBrowserUTCOffsetMs();

@Component({
  tag: 'noi-last-sync',
  styleUrl: './last-sync.css',
  scoped: true,
})
export class LastSync {
  @Prop()
  syncDate!: Date;


  render() {
    const hostClass = {
      'last-sync': true,
    };
    return (
      <Host class={hostClass}>
          <svg class="last-sync__icon" height="19" viewBox="0 0 22 19" width="22" xmlns="http://www.w3.org/2000/svg"><path d="m21.0735024 13.225331 1.5726989 6.9558004-1.9507594.4410646-.837068-3.7041597c-1.610941 3.0425701-4.8017609 5.0451272-8.3825393 5.0451272-4.16390166 0-7.79562527-2.7073911-9.03519719-6.5989573l-.08078759-.2671512 1.92268093-.550725c.91138411 3.1818072 3.83308551 5.4168335 7.19330385 5.4168335 2.6478705 0 5.0258884-1.388028 6.3604911-3.5379024l-3.2760154 1.1010644-.6376431-1.8956295zm-9.5976678-10.225331c4.2433619 0 7.9269849 2.81085725 9.0988916 6.80703642l.0743847.26815018-1.9348492.5063186c-.8539584-3.26332176-3.8158549-5.5815052-7.2384271-5.5815052-2.61342561 0-4.96217966 1.35202102-6.30572101 3.45095608l3.91577739-1.31659528.63764312 1.89562951-7.15083525 2.40536509-1.57269885-6.9558005 1.95075936-.44106455.69822737 3.08753402c1.7258202-2.51882707 4.61873863-4.12602437 7.82684787-4.12602437z" fill="#a2cbde" fill-rule="evenodd" transform="translate(-1 -3)"/></svg>
          {translate('path-details.last-sync')}
          <span class="last-sync__date">{this.syncDate ? formatDate(this.syncDate, offsetMs) : ''}</span>
      </Host>
    );
  }
}