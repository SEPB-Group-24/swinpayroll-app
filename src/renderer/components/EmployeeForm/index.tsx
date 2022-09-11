import { Component } from 'react';

import { FetchApi } from 'renderer/components/Auth';
import MasterForm, { Resource } from 'renderer/components/MasterForm';
import { Data, Files } from 'renderer/pages/MasterPage';

enum MaritalStatus {
  SINGLE = 'single',
  DE_FACTO = 'de_facto',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
  OTHER = 'other'
}

enum Sex {
  M = 'm',
  F = 'f',
  O = 'o'
}

export interface Employee {
  id?: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  date_of_birth: string;
  sex: Sex;
  marital_status: MaritalStatus;
  referee: string;
  emergency_name: string;
  emergency_address: string;
  emergency_phone: string;
  hired_date: string;
  skill: string;
  hourly_rate: number;
  overtime_rate: number;
  project_id: string;
  position_id: string;
  subcontract_id?: string;
}

interface Props {
  employee?: Employee;
  fetchApi: FetchApi;
  onClose: () => void;
  onDelete: () => void;
  onSubmit: (data: Data, files: Files) => void;
  positions: Resource[]
  projects: Resource[];
  subcontracts: Resource[];
}

interface State {
  employee: Employee;
  files: Files;
  photoNonce: string;
  photoSrc: string | undefined;
}

const maritalStatusLabels: Record<MaritalStatus, string> = {
  [MaritalStatus.SINGLE]: 'Single',
  [MaritalStatus.DE_FACTO]: 'De Facto',
  [MaritalStatus.MARRIED]: 'Married',
  [MaritalStatus.DIVORCED]: 'Divorced',
  [MaritalStatus.WIDOWED]: 'Widowed',
  [MaritalStatus.OTHER]: 'Other'
};

const sexLabels: Record<Sex, string> = {
  [Sex.M]: 'Male',
  [Sex.F]: 'Female',
  [Sex.O]: 'Other'
};

export default class EmployeeForm extends Component<Props, State> {
  get defaultState() {
    return {
      employee: this.props.employee ?? {
        code: '',
        name: '',
        address: '',
        phone: '',
        date_of_birth: '',
        sex: Sex.M,
        marital_status: MaritalStatus.SINGLE,
        referee: '',
        emergency_name: '',
        emergency_address: '',
        emergency_phone: '',
        hired_date: '',
        skill: '',
        hourly_rate: 0,
        overtime_rate: 0,
        project_id: '',
        position_id: '',
        subcontract_id: undefined
      },
      files: {},
      photoNonce: Date.now().toString(),
      photoSrc: undefined
    };
  }
  constructor(props: Props) {
    super(props);

    this.state = this.defaultState;

    this.loadPhotoSrc();
  }

  componentDidUpdate(prevProps: Props) {
    if (!!prevProps.employee !== !!this.props.employee) {
      this.setState(this.defaultState);
      this.loadPhotoSrc();
    }
  }

  async loadPhotoSrc() {
    const { employee } = this.props;
    if (!employee) {
      return;
    }

    const blob = await this.props.fetchApi('GET', `employees/${employee.id}/photo`);
    this.setPhotoSrc(blob);
  }

  setPhotoSrc(blob: Blob) {
    const fileReader = new FileReader();

    fileReader.onload = ({ target }) => {
      if (!target || !target.result) {
        return;
      }

      this.setState({
        photoSrc: target.result as string
      });
    };

    fileReader.readAsDataURL(blob);
  }

  render() {
    const { positions, projects, subcontracts } = this.props;
    const { employee } = this.state;
    return (
      <MasterForm<State['employee']>
        isEditing={!!employee}
        onChange={(key, value) => {
          if (!key) {
            return;
          }

          this.setState({
            employee: {
              ...this.state.employee,
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
        onSubmit={() => this.props.onSubmit(this.state.employee as unknown as Record<string, unknown>, this.state.files)}
      >
        <>
          <div>
            <div>
              Employee #:
              <input name="code" type="text" value={employee.code} />
            </div>

            <div>
              Name:
              <input name="name" type="text" value={employee.name} />
            </div>
            <div>
              Address:
              <input name="address" type="text" value={employee.address} />
            </div>

            <div>
              Phone:
              <input name="phone" type="text" value={employee.phone} />
            </div>

            <div>
              DOB:
              <input name="date_of_birth" type="date" value={employee.date_of_birth} />
            </div>

            <div>
              <div>Sex:</div>
              <select name="sex" value={employee.sex}>
                {Object.entries(sexLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <div>Marital Status:</div>
              <select name="marital_status" value={employee.marital_status}>
                {Object.entries(maritalStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              Referee:
              <input name="referee" type="text" value={employee.referee} />
            </div>

            <div>
              Date Hired:
              <input name="hired_date" type="date" value={employee.hired_date} />
            </div>

            <div>
              Pay Rate:
              <input name="hourly_rate" type="number" min="0" step="0.01" value={employee.hourly_rate} />
            </div>

            <div>
              <div>Skills:</div>
              <textarea name="skill" value={employee.skill}></textarea>
            </div>

            <div>
              <div>Subcontract:</div>
              <select name="subcontract_id" value={employee.subcontract_id}>
                {MasterForm.renderSelectOptions(subcontracts, true)}
              </select>
            </div>
          </div>
          <div>
            <img key={this.state.photoNonce} src={this.state.photoSrc} />

            <div>
              Image:
            </div>
            <input
                accept="image/*"
                name="photo"
                type="file"
                onChange={({ currentTarget }) => {
                  if (!currentTarget || !currentTarget.files) {
                    return;
                  }

                  this.setPhotoSrc(currentTarget.files[0]);
                }}
              />

            <div>
              <div>CV:</div>
              <input accept="application/pdf" name="cv" type="file" />
            </div>

            <div>
              <div>Position:</div>
              <select name="position_id" value={employee.position_id}>
                {MasterForm.renderSelectOptions(positions, !employee.position_id)}
              </select>
            </div>

            <div>
              <div>Project:</div>
              <select name="project_id" value={employee.project_id}>
                {MasterForm.renderSelectOptions(projects, !employee.project_id)}
              </select>
            </div>

            <div>Emergency Contact</div>

            <div>
              Name:
              <input name="emergency_name" type="text" value={employee.emergency_name} />
            </div>

            <div>
              Address:
              <input name="emergency_address" type="text" value={employee.emergency_address} />
            </div>

            <div>
              Phone:
              <input name="emergency_phone" type="text" value={employee.emergency_phone} />
            </div>
          </div>
        </>
      </MasterForm>
    );
  }
}
