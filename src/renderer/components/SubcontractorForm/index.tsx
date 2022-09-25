import { Component } from 'react';
import { FetchApi } from 'renderer/components/Auth';
import MasterForm, { Resource } from 'renderer/components/MasterForm';
import { Data } from 'renderer/pages/MasterPage';

export interface Subcontractor {
  id?: string;
  code: string;
  name: string;
  start_date: string;
  project_id?: string;
  value: string;
  down_payment1: string;
  down_payment2: string;
  down_payment3: string;
}

interface Props {
  subcontractor?: Subcontractor;
  fetchApi: FetchApi;
  onClose: () => void;
  onDelete: () => void;
  onSubmit: (data: Data) => void;
  projects: Resource[];
}

interface State {
  subcontractor: Subcontractor;
}

export default class SubcontractorForm extends Component<Props, State> {
  get defaultState() {
    return {
      subcontractor: this.props.subcontractor ?? {
        name: '',
        start_date: '',
        code: '',
        project_id: undefined,
        value: '',
        down_payment1: '',
        down_payment2: '',
        down_payment3: ''
      }
    };
  }

  constructor(props: Props) {
    super(props);

    this.state = this.defaultState;
  }

  componentDidUpdate(prevProps: Props) {
    if (!!prevProps.subcontractor !== !!this.props.subcontractor) {
      this.setState(this.defaultState);
    }
  }

  render() {
    const { projects } = this.props;
    const { subcontractor } = this.state;
    return (
      <MasterForm<State['subcontractor']>
        isEditing={!!subcontractor}
        onChange={(key, value) => {
          if (!key) {
            return;
          }

          this.setState({
            subcontractor: {
              ...this.state.subcontractor,
              [key]: value
            }
          })
        }}
        onClose={this.props.onClose}
        onDelete={this.props.onDelete}
        onSubmit={() => this.props.onSubmit(this.state.subcontractor as unknown as Record<string, unknown>)}
        >
        <div>
          <div>
            Sub-Contractor Code:
              <input name="code" type="text" value={this.state.subcontractor.code} />    
          </div>
          <div>
            Name:
              <input name="name" type="text" value={this.state.subcontractor.name} />
          </div>
          <div>
            Contract Start Date:
              <input name="start_date" type="date" value={this.state.subcontractor.start_date} />
          </div>
          <div>
            Project Code:
              <select name="project_code" value={this.state.subcontractor.project_id}>
                {MasterForm.renderSelectOptions(projects, true)}
              </select>
          </div>
          <div>
            Contract Value:
              <input name="value" type="number" min="0" step="0.01" value={this.state.subcontractor.value} />
          </div>
          <div>
            <div>
              Down Payment 1:
                <input name="down_payment1" type="number" min="0" step="0.01" value={this.state.subcontractor.down_payment1} />
            </div>
            <div>
              Down Payment 2:
                <input name="down_payment2" type="number" min="0" step="0.01" value={this.state.subcontractor.down_payment2} />
            </div>
            <div>
              Down Payment 3:
                <input name="down_payment3" type="number" min="0" step="0.01" value={this.state.subcontractor.down_payment3} />
            </div>
          </div>
        </div>
        </MasterForm>
    );
  }
}