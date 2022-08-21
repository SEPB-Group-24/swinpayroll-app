import { ChangeEvent, Component, FormEvent, ReactElement } from 'react';
import './style.scss';

export interface Resource {
  code: string;
  id: string;
  name: string;
}

interface Props<TResource> {
  children: ReactElement;
  isEditing: true;
  onChange: (key: keyof TResource, value: TResource[keyof TResource]) => void;
  onClose: () => void;
  onDelete: () => void;
  onFileChange: (key: string, value: File) => void;
  onSubmit: () => void;
}

export default class MasterForm<TResource> extends Component<Props<TResource>> {
  static renderSelectOptions(resources: Resource[], optional = false) {
    return [
      ...optional ? [
        <option key="none" value={undefined}>None</option>
      ] : [],
      ...resources.map(({ code, id, name }, index) => (
        <option key={index} value={id}>{name} ({code})</option>
      ))
    ]
  }

  render() {
    return (
      <div className="MasterForm">
        <form
          onChange={({ target: { files, name, type, value } }: ChangeEvent<HTMLFormElement>) => {
            if (type === 'file') {
              this.props.onFileChange(name, files[0]);
            } else if (type === 'number') {
              const parsedValue = parseFloat(value);
              this.props.onChange(name as keyof TResource, (isNaN(parsedValue) ? 0 : parsedValue) as unknown as TResource[keyof TResource]);
            } else {
              this.props.onChange(name as keyof TResource, value);
            }
          }}
          onSubmit={(event: FormEvent) => {
            event.preventDefault();

            this.props.onSubmit();
          }}
        >
          {this.props.children}
          <div>
            <button onClick={this.props.onClose} type="button">
              Close
            </button>
            <button type="submit">
              Save
            </button>
            {this.props.isEditing && (
              <button className="delete" onClick={this.props.onDelete} type="button">
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }
}
