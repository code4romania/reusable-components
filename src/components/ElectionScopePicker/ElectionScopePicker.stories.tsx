/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React, { useState } from "react";
import { ElectionScope } from "../../types/Election";
import { mockElectionAPI } from "../../util/mocks";
import { ElectionScopePicker, useElectionScopePickerApi } from "./ElectionScopePicker";

export default {
  title: "Election scope picker",
  component: ElectionScopePicker,
};

export const SimpleExample = () => {
  const [scope, setScope] = useState<ElectionScope>({ type: "national" });
  const apiData = useElectionScopePickerApi(mockElectionAPI, scope);
  return <ElectionScopePicker apiData={apiData} value={scope} onChange={setScope} />;
};
