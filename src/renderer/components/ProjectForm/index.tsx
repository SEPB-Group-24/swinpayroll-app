import { Component } from 'react';

import { FetchApi } from 'renderer/components/Auth';
import MasterForm, { Resource } from 'renderer/components/MasterForm';
import { Data, Files } from 'renderer/pages/MasterPage';

export interface Project {
  id?: string;
  code: string;
  name: string;
  acronym: string;
  accumulation_amount: string;
  project_group: string;
  start_date: string;
  end_date: string;
  address: string;
}

interface Props {
  project?: Project;
  fetchApi: FetchApi;
  onClose: () => void;
  onDelete: () => void;
  onSubmit: (data: Data, files: Files) => void;
}

interface State {
  project: Project;
  files: Files;
  photoNonce: string;
  photoSrc: string | undefined;
}

export default class ProjectForm extends Component<Props, State> {
  get defaultState() {
    return {
      project: this.props.project ?? {
        code: '',
        name: '',
        acronym: '',
        accumulation_amount: '',
        project_group: '',
        start_date: '',
        end_date: '',
        address: '',
      },
      files: {},
      photoNonce: Date.now().toString(),
      photoSrc: undefined,
    };
  }
  constructor(props: Props) {
    super(props);

    this.state = this.defaultState;

    this.loadPhotoSrc();
  }

  componentDidUpdate(prevProps: Props) {
    if (!!prevProps.project !== !!this.props.project) {
      this.setState(this.defaultState);
      this.loadPhotoSrc();
    }
  }

  async loadPhotoSrc() {
    const { project } = this.props;
    if (!project) {
      return;
    }

    const blob = await this.props.fetchApi(
      'GET',
      `projects/${project.id}/photo`
    );
    this.setPhotoSrc(blob);
  }

  setPhotoSrc(blob: Blob) {
    const fileReader = new FileReader();

    fileReader.onload = ({ target }) => {
      if (!target || !target.result) {
        return;
      }

      this.setState({
        photoSrc: target.result as string,
      });
    };

    fileReader.readAsDataURL(blob);
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
              [key]: value,
            },
          });
        }}
        onClose={this.props.onClose}
        onDelete={this.props.onDelete}
        onFileChange={(key, value) =>
          this.setState({
            files: {
              ...this.state.files,
              [key]: value,
            },
          })
        }
        onSubmit={() =>
          this.props.onSubmit(
            this.state.project as unknown as Record<string, unknown>,
            this.state.files
          )
        }
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
              <input
                name="accumulation_amount"
                type="text"
                value={project.accumulation_amount}
              />
            </div>

            <div>
              Project Group:
              <input
                name="project_group"
                type="text"
                value={project.project_group}
              />
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
