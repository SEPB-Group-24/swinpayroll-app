import { Component } from 'react';

import { FetchApi } from 'renderer/components/Auth';
import MasterForm, { Resource } from 'renderer/components/MasterForm';
import { Data, Files } from 'renderer/pages/MasterPage';


export interface InsuranceCompany {
  id?: string;
  code: string;
  name: string;
}

interface Props {
  insurance_company?: InsuranceCompany;
  fetchApi: FetchApi;
  onClose: () => void;
  onDelete: () => void;
  onSubmit: (data: Data, files: Files) => void;
}

interface State {
  insurance_company: InsuranceCompany;
  files: Files;

}

export default class InsuranceCompanyForm extends Component<Props, State> {
  get defaultState() {
    return {
      insurance_company: this.props.insurance_company ?? {
        code: '',
        name: ''
      },
      files: {},
    };
  }
  constructor(props: Props) {
    super(props);
    this.state = this.defaultState;
  }

  componentDidUpdate(prevProps: Props) {
    if (!!prevProps.insurance_company !== !!this.props.insurance_company) {
      this.setState(this.defaultState);
    }
  }

  render() {

    const { insurance_company } = this.state;
    return (
      <MasterForm<State['insurance_company']>
        isEditing={!!insurance_company}
        onChange={(key, value) => {
          if (!key) {
            return;
          }

          this.setState({
            insurance_company: {
              ...this.state.insurance_company,
              [key]: value
            }
          })
        }}
        onClose={this.props.onClose}
        onDelete={this.props.onDelete}
        onFileChange={(key, value) => this.setState({
          files: {
            ...this.state.files,
            [key]: value
          }
        })}
        onSubmit={() => this.props.onSubmit(this.state.insurance_company as unknown as Record<string, unknown>, this.state.files)}
      >
        <>
          <div>
            <div>
              Company Code:
              <input name="code" type="text" value={insurance_company.code} />
            </div>
          </div>
          <div>
            <div>
              Company Name:
              <input name="name" type="text" value={insurance_company.name} />
            </div>
          </div>
        </>
      </MasterForm>
    );
  }
}
