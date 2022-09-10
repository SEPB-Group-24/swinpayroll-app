import { Component } from 'react';

import { FetchApi } from 'renderer/components/Auth';
import MasterForm, { Resource } from 'renderer/components/MasterForm';
import { Data, Files } from 'renderer/pages/MasterPage';

export interface Project {
  id?: string;
  code: string;
  name: string;
  acronym: string;
  accumulation_amount: number;
  address: string;
  end_date: string;
  project_group: string;
  start_date: string;
}

interface Props {
  project?: Project;
  fetchApi: FetchApi;
  onClose: () => void;
  onDelete: () => void;
  onSubmit: (data: Data) => void;
}

interface State {
  project: Project;
}

export default class ProjectForm extends Component<Props, State> {
  get defaultState() {
    return {
      project: this.props.project ?? {
        code: '',
        name: '',
        acronym: '',
        accumulation_amount: 0,
        address: '',
        end_date: '',
        project_group: '',
        start_date: ''
      }
    };
  }
  constructor(props: Props) {
    super(props);

    this.state = this.defaultState;
  }

  componentDidUpdate(prevProps: Props) {
    if (!!prevProps.project !== !!this.props.project) {
      this.setState(this.defaultState);
    }
  }

  render() {
    const { project } = this.state;
    return (
      <MasterForm<State['project']>
        isEditing={!!project}
        onChange={(key, value) => {
          if (!key) {
            return;
          }

          this.setState({
            project: {
              ...this.state.project,
              [key]: value
            }
          })
        }}
        onClose={this.props.onClose}
        onDelete={this.props.onDelete}
        onSubmit={() => this.props.onSubmit(this.state.project as unknown as Record<string, unknown>)}
      >
        <>
          <div>
            <div>
              Project #:
              <input name="code" type="text" value={project.code} />
            </div>

            <div>
              Name:
              <input name="name" type="text" value={project.name} />
            </div>

            <div>
              Acronym:
              <input name="acronym" type="text" value={project.acronym} />
            </div>

            <div>
              Accumulation Amount:
              <input name="accumulation_amount" type="number" min="0" step="0.01" value={project.accumulation_amount} />
            </div>

            <div>
              Project Group:
              <input name="project_group" type="text" value={project.project_group} />
            </div>

            <div>
              Start Date:
              <input name="start_date" type="date" value={project.start_date} />
            </div>

            <div>
              End Date:
              <input name="end_date" type="date" value={project.end_date} />
            </div>

            <div>
              Address:
              <input name="address" type="text" value={project.address} />
            </div>
          </div>
        </>
      </MasterForm>
    );
  }
}
