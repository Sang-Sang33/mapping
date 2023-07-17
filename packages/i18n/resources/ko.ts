const ko = {
  notFound: {
    subTitle: '죄송합니다. 방문하신 페이지가 존재하지 않습니다.',
    backHome: '홈으로 돌아가기'
  },
  layout: {
    header: {
      setting: {
        pageStyle: '페이지 스타일 설정',
        themeColor: '테마 색상',
        themes: {
          dark: '다크 스타일',
          light: '라이트 스타일'
        },
        colors: {
          dustRed: '더스트 레드',
          volcano: '볼케이노',
          sunsetOrange: '선셋 오렌지',
          cyan: '시안',
          polarGreen: '폴라 그린',
          daybreakBlue: '데이브레이크 블루',
          geekBlue: '기크 블루',
          goldenPurple: '황금 보라색'
        }
      },
      logout: '로그아웃'
    }
  },
  workflowEngine: {
    empty: {
      goToCreate: '생성하러 가기',
      chooseWorkflow: '워크플로우를 선택하세요'
    },
    action: {
      title: '작업',
      add: '추가',
      edit: '편집',
      delete: '삭제',
      copy: '복사',
      paste: '붙여넣기',
      import: '가져오기',
      export: '내보내기',
      debug: '디버그',
      deletePopConfirmTitle: '삭제 확인',
      copyDialogTitle: '복사할 데이터를 선택하세요',
      exportDialogTitle: '내보낼 데이터를 선택하세요',
      deleteSuccess: '삭제되었습니다',
      addSuccess: '추가되었습니다',
      updateSuccess: '업데이트되었습니다',
      copySuccess: '복사되었습니다',
      pasteNull: '먼저 데이터를 복사해주세요',
      pasteInvalid: '붙여넣을 수 없습니다',
      importInvalid: '가져올 수 없습니다',
      deleteCancel: '삭제 취소',
      fileInvalid: 'JSON 파일을 선택해주세요',
      pasteSuccess: '붙여넣기 완료',
      importSuccess: '가져오기 완료',
      selectNull: '먼저 데이터를 선택하세요'
    },
    debugDialog: {
      title: '디버그',
      keyValuePair: '키-값 쌍',
      key: '키',
      valueType: '값 유형',
      value: '값',
      add: '추가',
      jsonInvalid: '유효한 JSON 데이터를 입력하세요',
      keyNull: '키를 입력하세요',
      keyPlaceholder: '키 입력',
      valueTypeNull: '값 유형을 선택하세요',
      valueTypePlaceholder: '값 유형 선택',
      valueTypeString: '문자열',
      valueTypeNumber: '숫자',
      valueTypeBoolean: '부울',
      valueNull: '값을 입력하세요',
      valuePlaceholder: '값 입력'
    },
    importDialog: {
      title: 'JSON 파일 가져오기',
      importText: '파일을 클릭하거나 드래그하여 가져오기',
      importHint: '단일 파일 가져오기 지원'
    },
    multiCheckDialog: {
      selectAll: '전체 선택',
      deselectAll: '전체 선택 해제',
      cancel: '닫기',
      confirm: '확인'
    },
    menuList: {
      selectAll: '전체 선택'
    }
  },
  device: {
    title: '장치',
    edit: '장치 편집',
    addDialog: {
      deviceName: '장치명',
      functionName: '기능',
      behaviour: '동작',
      cannotContainDecimalPoint: '소수점을 포함할 수 없습니다',
      behaviourSwitchChecked: '액티브',
      behaviourSwitchUnChecked: '패시브'
    },
    editDialog: {
      oldName: '이전 장치명',
      newName: '새로운 장치명'
    }
  },
  function: {
    title: '기능'
  },
  event: {
    title: '이벤트',
    addDialog: {
      name: '이벤트명',
      cannotContainDecimalPoint: '소수점을 포함할 수 없습니다'
    }
  }
}
export default ko
