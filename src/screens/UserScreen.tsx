import ControlPanel from '../components/ControlPanel';
import TodoList from '../components/TodoList';
import TodoDialog from '../components/TodoDialog';

const UserScreen = () => {
  return (
    <>
        <ControlPanel  />

        <TodoList />

        <TodoDialog />
    </>
  )
}

export default UserScreen