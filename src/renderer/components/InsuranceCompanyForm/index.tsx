import { Component } from 'react';

import { FetchApi } from 'renderer/components/Auth';
import MasterForm, { Resource } from 'renderer/components/MasterForm';
import { Data } from 'renderer/pages/MasterPage';

export interface InsuranceCompany {
  id?: string;
  code: string;
  name: string;
}

interface Props {
  insuranceCompany?: InsuranceCompany;
  fetchApi: FetchApi;
  onClose: () => void;
  onDelete: () => void;
  onSubmit: (data: Data) => void;
}

interface State {
  insuranceCompany: InsuranceCompany;
}

export default class InsuranceCompanyForm extends Component<Props, State> {
  get defaultState() {
    return {
      insuranceCompany: this.props.insuranceCompany ?? {
        code: '',
        name: ''
      }
    };
  }

  constructor(props: Props) {
    super(props);
    this.state = this.defaultState;
  }

  componentDidUpdate(prevProps: Props) {
    if (!!prevProps.insuranceCompany !== !!this.props.insuranceCompany) {
      this.setState(this.defaultState);
    }
  }

  render() {
    const { insuranceCompany } = this.state;
    return (
      <MasterForm<State['insuranceCompany']>
        isEditing={!!insuranceCompany}
        onChange={(key, value) => {
          if (!key) {
            return;
          }

          this.setState({
            insuranceCompany: {
              ...this.state.insuranceCompany,
              [key]: value
            }
          })
        }}
        onClose={this.props.onClose}
        onDelete={this.props.onDelete}
        onSubmit={() => this.props.onSubmit(this.state.insuranceCompany as unknown as Record<string, unknown>)}
      >
        <>
          <div>
            <div>
              Company Code:
              <input name="code" type="text" value={insuranceCompany.code} />
            </div>
          </div>
          <div>
            <div>
              Company Name:
              <input name="name" type="text" value={insuranceCompany.name} />
            </div>
          </div>
        </>
      </MasterForm>
    );
  }
}
